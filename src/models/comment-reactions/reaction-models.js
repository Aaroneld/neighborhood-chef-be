const db = require('../../../data/dbConfig.js');

module.exports = {
    findAllCommentReactions,
    findBy,
    add,
    update,
    remove,
};

function findAllCommentReactions(id) {
    return db('Comment_Reactions').where('comment_id', id);
}

function findBy(reaction) {
    return db('Comment_Reactions')
        .where('comment_id', reaction.comment_id)
        .andWhere('user_id', reaction.user_id)
        .first();
}

async function add(input) {
    const reaction = await db('Comment_Reactions').insert(input);

    return findAllCommentReactions(input.comment_id);
}

async function update(changes) {
    const updated = await db('Comment_Reactions')
        .where('comment_id', changes.comment_id)
        .andWhere('user_id', changes.user_id)
        .update(changes)
        .returning('comment_id');

    return await findAllCommentReactions(changes.comment_id);
}

async function remove(reaction) {
    const deleted = await db('Comment_Reactions')
        .where('comment_id', reaction.comment_id)
        .andWhere('user_id', reaction.user_id)
        .del();

    return await findAllCommentReactions(reaction.comment_id);
}
