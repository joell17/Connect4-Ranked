const AVLTree = require("../src/models/AVLTree"); // Adjust the path as needed
const PlayerData = require("../src/models/PlayerData");

describe("AVLTree", () => {
    let tree;

    beforeEach(() => {
        tree = new AVLTree();
    });

    // test("insert and delete nodes with specific values", () => {
    //     tree.insertNode(33);
    //     tree.insertNode(13);
    //     tree.insertNode(53);
    //     tree.insertNode(9);
    //     tree.insertNode(21);
    //     tree.insertNode(61);
    //     tree.insertNode(8);
    //     tree.insertNode(11);
    //     const preOrderBeforeDeletion = [];
    //     tree.preOrder((item) => preOrderBeforeDeletion.push(item));
    //     expect(preOrderBeforeDeletion).toEqual([33, 13, 9, 8, 11, 21, 53, 61]);

    //     tree.deleteNode(13);
    //     const preOrderAfterDeletion = [];
    //     tree.preOrder((item) => preOrderAfterDeletion.push(item));
    //     expect(preOrderAfterDeletion).toEqual([33, 9, 8, 21, 11, 53, 61]);
    // });

    test("insert and delete nodes with PlayerData objects using compareTo", () => {
        const playerData1 = new PlayerData({ id: "1", elo: 33 }, null);
        const playerData2 = new PlayerData({ id: "2", elo: 13 }, null);
        const playerData3 = new PlayerData({ id: "3", elo: 53 }, null);
        const playerData4 = new PlayerData({ id: "4", elo: 9 }, null);
        const playerData5 = new PlayerData({ id: "5", elo: 21 }, null);
        const playerData6 = new PlayerData({ id: "6", elo: 61 }, null);
        const playerData7 = new PlayerData({ id: "7", elo: 8 }, null);
        const playerData8 = new PlayerData({ id: "8", elo: 11 }, null);

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

    test("inorder traversal with PlayerData objects", () => {
        const playerData1 = new PlayerData({ id: "1", elo: 33 }, null);
        const playerData2 = new PlayerData({ id: "2", elo: 13 }, null);
        const playerData3 = new PlayerData({ id: "3", elo: 53 }, null);
        const playerData4 = new PlayerData({ id: "4", elo: 9 }, null);
        const playerData5 = new PlayerData({ id: "5", elo: 21 }, null);
        const playerData6 = new PlayerData({ id: "6", elo: 61 }, null);
        const playerData7 = new PlayerData({ id: "7", elo: 8 }, null);
        const playerData8 = new PlayerData({ id: "8", elo: 11 }, null);
    
        tree.insertNode(playerData1);
        tree.insertNode(playerData2);
        tree.insertNode(playerData3);
        tree.insertNode(playerData4);
        tree.insertNode(playerData5);
        tree.insertNode(playerData6);
        tree.insertNode(playerData7);
        tree.insertNode(playerData8);
    
        const inOrderResult = [];
        tree.inOrder((item) => inOrderResult.push(item.elo));
        expect(inOrderResult).toEqual([8, 9, 11, 13, 21, 33, 53, 61]);
    });
    
});
