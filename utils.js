module.exports = {
    snapshotToArray: snapshotToArray,
}

function snapshotToArray(snapshot, genKey) {
    var returnArr = [];
    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        if (genKey) {
            item.id = childSnapshot.key;
        }
        returnArr.push(item);
    });
    return returnArr;
};