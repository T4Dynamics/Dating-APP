import * as interests from '../data/interests.json';
import * as goals from '../data/relationshipType.json';

export default class User {

    constructor(data, id) {
        this.id = id ?? data.id;
        this.imageUrl = data.imageUrl;
        this.premium = data.premium;
        
        this.name = data.name;
        this.firstName = data.name.split(' ')[0];
        this.age = data.age;
        this.gender = data.gender;

        this.description = data.match_data.description;
        this.likes = data.match_data.likes;
        this.dislikes = data.match_data.dislikes;
        this.goal = data.match_data.relationshipType;
        this.attraction = data.match_data.attraction;
        this.age_range = data.match_data.ageRange;
    }

    getId() {
        return this.id;
    }

    getImageUrl() {
        return this.imageUrl;
    }

    getName() {
        return this.name;
    }

    getFirstName() {
        return this.name.split(' ')[0];
    }

    getAge() {
        let birthDate = new Date(this.age * 1000);  // Convert to milliseconds
        let currentDate = new Date();
        
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        let m = currentDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
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

    getPremium() {
        return this.premium;
    }

    getAgeRange() {
        return this.age_range;
    }
}