import { Navbar, Nav, Container } from 'react-bootstrap';
import UserDropDown from './UserDropDown';
import HomeButton from './HomeButton';


const Mainbar : React.FC = () =>
{   
    return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container fluid>
          <HomeButton />
         
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            <UserDropDown />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Mainbar