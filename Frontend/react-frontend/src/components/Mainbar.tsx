import { Navbar, Nav, Container } from 'react-bootstrap';
import UserDropDown from './UserDropDown';
import HomeButton from './HomeButton';
import { Link } from 'react-router-dom';


const Mainbar : React.FC = () =>
{   
    return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="shadow-sm" >
      <Container fluid>
          <HomeButton />
         
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/communities" className="fw-semibold">
              <i className="bi bi-people me-1"></i>Communities
            </Nav.Link>
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