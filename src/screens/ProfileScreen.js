import Nav from '../components/Nav';
import Background from '../components/Nav';

export default function ProfileScreen({ navigation }) {
    return (
        <Background>
            <Nav
                navigation={navigation}
                page='ProfileScreen'
            />
        </Background>
    );
}

