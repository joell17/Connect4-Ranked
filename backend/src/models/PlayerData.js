class PlayerData {
    constructor(user_data, client_ws) {
        this.user_data = user_data;
        this.elo = user_data.elo;
        this.client_ws = client_ws;
        this.join_time = new Date().getTime();
        this.rating_range = 50;
        this.id = user_data.id;
    }

    compareTo(other) {
        if (this.elo !== other.elo) {
            return this.elo - other.elo;
        } else {
            console.log(this.id);
            return this.id.localeCompare(other.id); // Compare IDs if Elo ratings are equal
        }
    }
}

module.exports = PlayerData;
