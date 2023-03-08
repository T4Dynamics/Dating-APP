import * as interests from '../data/interests.json';
import * as goals from '../data/relationshipType.json';

export default class User {

    constructor(data) {

        console.log("checked!    " + data);

        this.rawData = data;

        this.name = data.name;
        this.age = data.age;
        this.gender = data.gender;
        this.email = data.email;

        this.description = data.description;
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.goal = data.goal;
        this.attraction = data.attraction;
    }

    getRawData() {
        return this.rawData;
    }

    getName() {
        return this.name;
    }

    getAge() {
        return this.age;
    }

    getGender() {
        return this.gender;
    }

    getEmail() {
        return this.email;
    }

    getDescription() {
        return this.description;
    }

    getLikes() {
        const likes = this.likes;

        return likes.map(like => {
            return interests['default'][like];
        });
    }

    getDislikes() {
        const dislikes = this.dislikes;

        return dislikes.map(dislike => {
            return interests['default'][dislike];
        });
    }

    getGoal() {
        return goals['default'][this.goal];
    }

    getAttraction() {
        return this.attraction;
    }
}