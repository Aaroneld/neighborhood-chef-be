const express = require('express');
const buildHTML = require('../utils/htmltemplatebuilder');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');
const okta = require('@okta/okta-sdk-nodejs');
const temp = require('temp');
const cors = require('cors');
const users = require('../models/users/user-models');
const { isEmailUnique } = require('../middleware/isEmailUnique.js');
const { addNewImage } = require('../graphql/utilities');
const readFile = promisify(fs.readFile);
const router = express.Router();
const os = require('os');

router.use(express.json());
router.use(cors());

router.get('/', (req, res) => {
  res.status(200).send('<h1>Working!</h1>');
});

router.post('/register', cors(), isEmailUnique, buildHTML, async (req, res) => {
  try {
    const { email, firstName, lastName, latitude, longitude, gender, address, photo } = req.body;

    const databaseUserObject = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      latitude: latitude,
      longitude: longitude,
      gender: gender,
      address: address,
      photo: photo,
    };

    const transport = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE_PROVIDER,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlFile = await readFile(req.tempPathName);

    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'NeighborhoodChef',
      html: htmlFile,
      replyTo: process.env.EMAIL_NAME,
    };

    //console.log(mailOptions);

    if (mailOptions.html) {
      await transport.sendMail(mailOptions, async (err, response) => {
        try {
          if (err) console.log(err);

          res.status(500).json({
            success: false,
            trace: err.stack,
            message: err.message,
          });
        } catch (err) {
          console.log(err);

          res.status(500).json({
            success: false,
            trace: err.stack,
            message: err.message,
          });
        }
      });
    }

    temp.cleanup((err, stat) => {
      // console.log(stat, 'stat');
      if (err) console.log(err);
    });

    if (req.body.photo && !req.body.photo.startsWith('http')) {
      databaseUserObject.photo = await addNewImage(req.body.photo);
    }

    const addedUser = await users.add(databaseUserObject);

    addedUser
      ? res.status(201).json({
          success: true,
          message: 'User created -- activation required',
        })
      : res.status(500).json({
          success: false,
          trace: err.stack,
          message: 'There was an issue with registration',
        });
  } catch (err) {
    res.status(500).json({ message: err.message, trace: err.stack });
  }
});

router.get('/activate', async (req, res, next) => {
  try {
    // let { id, email, tempPass } = req.query;
    let url = req.url.split('?')[1];
    let id = url.split('id=')[1].split('&')[0];
    let email = url.split('email=')[1].split('&')[0];
    let tempPass = url.split('tempPass=')[1];

    // “/activate?id=cq7qnFtjfC012CsBfhDJ%2BEexUl8d3PPYjgeihG8q35o%3D&email=nightsurgeonpdx%40gmail.com&tempPass=dNxFxoy~Y7n”

    // console.log(req.url);

    console.log(email, tempPass, id);

    // email = decodeURIComponent(email);
    // tempPass = decodeURIComponent(tempPass);
    // id = decodeURIComponent(id);

    const compareHash = crypto
      .createHmac('sha256', process.env.EMAIL_HASH_SECRET)
      .update(email)
      .digest('base64');

    const formattedId = id.replace(/\s/g, '+');

    if (compareHash.toString() === formattedId) {
      const user = await users.findBy({ email });

      // console.log(email);
      const oktaUser = {
        profile: {
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email,
          login: user[0].email,
        },
        credentials: {
          password: { value: tempPass },
        },
        groupIds: [process.env.OKTA_GROUP_ID],
      };

      const stringified = JSON.stringify(oktaUser);

      // console.log(stringified);

      const response = await fetch(`https://${process.env.OKTA_BASE_URL}/api/v1/users?activate=true`, {
        method: 'post',
        body: stringified,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
        },
      });

      const formattedResponse = await response.json();
      console.log(formattedResponse);

      const hash = crypto
        .createHmac('sha256', process.env.EMAIL_HASH_SECRET)
        .update(formattedResponse.id)
        .digest('base64')
        .replace('/', '');

      if (response.status === 200) {
        activatedUser = await users.update(user[0].id, {
          ...user[0],
          activated: true,
        });
        res
          .status(301)
          .redirect(
            `${process.env.PASSWORD_CHANGE_REDIRECT}/initialChangePassword/${formattedResponse.id}-${hash}`
          );
        next;
      } else {
        res.status(500).json({
          success: false,
          message: 'Issue Creating Credentials with Okta',
        });
      }
    } else {
      res.status(400).json({ success: false, message: 'Not authorized' });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
});

router.post('/initialChangePassword', async (req, res, next) => {
  try {
    const { id, hash, password } = req.body;

    const compareHash = crypto
      .createHmac('sha256', process.env.EMAIL_HASH_SECRET)
      .update(id)
      .digest('base64')
      .replace('/', '');

    const formattedHash = hash.replace(/\s/g, '+');

    // console.log(id);
    // console.log(compareHash.toString());
    // console.log(hash);

    if (formattedHash === compareHash.toString()) {
      const client = new okta.Client({
        orgUrl: `https://${process.env.OKTA_BASE_URL}`,
        token: `${process.env.OKTA_API_TOKEN}`,
      });

      const user = await client.getUser(id);

      user.credentials.password.value = password;

      const updated = await user.update();
      // console.log(updated);

      if (updated.status) {
        res.status(203).json({
          success: true,
          message: 'Password updated',
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Password failed to update',
        });
      }
    } else {
      res.status(400).json({
        succes: false,
        message: 'Invalid authorization',
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

module.exports = router;
