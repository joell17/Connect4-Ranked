class PlayerData {
    constructor(user_data, client_ws) {
        this.user_data = user_data;
        this.elo = user_data.elo;
        this.client_ws = client_ws;
        this.join_time = new Date().getTime();
        this.rating_range = 50;
    }

    valueOf() {
        return this.elo;
    }
}

module.exports = PlayerData;