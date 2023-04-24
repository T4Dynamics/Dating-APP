import * as interests from '../data/interests.json';
import * as goals from '../data/relationshipType.json';

export default class User {

    constructor(data, id) {
        this.id = id;
        
        this.name = data.name;
        this.age = data.age;
        this.gender = data.gender;

        this.description = data.match_data.description;
        this.likes = data.match_data.likes;
        this.dislikes = data.match_data.dislikes;
        this.goal = data.match_data.relationship_goal;
        this.attraction = data.match_data.attraction;
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