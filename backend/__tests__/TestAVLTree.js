const AVLTree = require("../src/models/AVLTree"); // Adjust the path as needed
const PlayerData = require('../src/models/PlayerData');

describe("AVLTree", () => {
    let tree;

    beforeEach(() => {
        tree = new AVLTree();
    });

    test("insert and delete nodes with specific values", () => {
        tree.insertNode(33);
        tree.insertNode(13);
        tree.insertNode(53);
        tree.insertNode(9);
        tree.insertNode(21);
        tree.insertNode(61);
        tree.insertNode(8);
        tree.insertNode(11);
        const preOrderBeforeDeletion = [];
        tree.preOrder((item) => preOrderBeforeDeletion.push(item));
        expect(preOrderBeforeDeletion).toEqual([33, 13, 9, 8, 11, 21, 53, 61]);

        tree.deleteNode(13);
        const preOrderAfterDeletion = [];
        tree.preOrder((item) => preOrderAfterDeletion.push(item));
        expect(preOrderAfterDeletion).toEqual([33, 9, 8, 21, 11, 53, 61]);
    });

    test("insert and delete nodes with PlayerData objects", () => {
        const playerData1 = new PlayerData({ elo: 33 }, null);
        const playerData2 = new PlayerData({ elo: 13 }, null);
        const playerData3 = new PlayerData({ elo: 53 }, null);
        const playerData4 = new PlayerData({ elo: 9 }, null);
        const playerData5 = new PlayerData({ elo: 21 }, null);
        const playerData6 = new PlayerData({ elo: 61 }, null);
        const playerData7 = new PlayerData({ elo: 8 }, null);
        const playerData8 = new PlayerData({ elo: 11 }, null);

        tree.insertNode(playerData1);
        tree.insertNode(playerData2);
        tree.insertNode(playerData3);
        tree.insertNode(playerData4);
        tree.insertNode(playerData5);
        tree.insertNode(playerData6);
        tree.insertNode(playerData7);
        tree.insertNode(playerData8);

        const preOrderBeforeDeletion = [];
        tree.preOrder((item) => preOrderBeforeDeletion.push(item.elo));
        expect(preOrderBeforeDeletion).toEqual([33, 13, 9, 8, 11, 21, 53, 61]);

        tree.deleteNode(playerData2);
        const preOrderAfterDeletion = [];
        tree.preOrder((item) => preOrderAfterDeletion.push(item.elo));
        expect(preOrderAfterDeletion).toEqual([33, 9, 8, 21, 11, 53, 61]);
    });
});
