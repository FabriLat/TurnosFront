import { useState, useEffect, useContext } from "react";
import { Container, Navbar, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from './CheTurnosLogoBlanco.png';
import './UserNav.css';
import useValidateUser from "../hookCustom/useValidateUser";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";

const UserNav = () => {
  const [navActive, setNavActive] = useState(false);
  const navigate = useNavigate();

  const { isAdmin, isOwner, isEmployee, isClient } = useValidateUser();

  const { logoutHandler } = useContext(AuthenticationContext);

  const handleLogoutButton = () => {
    logoutHandler();
    navigate('/');
  }

  // cambia el estado de la navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavActive(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar className={`navbar-custom ${navActive ? 'active' : ''}`} variant="light">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col md={3}>
            <Nav className="d-flex align-items-center">
              <Navbar.Brand>
                <img
                  width={navActive ? "80" : "100"} // cambia el tamaño del logo al hacer scroll
                  height={navActive ? "40" : "50"}
                  className="d-block w-100 logo"
                  src={logo}
                  alt="Logo"
                  onClick={() => navigate("/")}
                  style={{cursor:'pointer'}}
                />
              </Navbar.Brand>
            </Nav>
          </Col>
          <Col md={1}></Col>
          <Col md={8}>
            <Nav className="d-flex justify-content-end align-items-center">

              {(isAdmin()) &&
                <>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/Users")}>Usuarios</Button>
                </>
              }
              {(isClient() || isAdmin()) &&
                <><Button variant="outline-light" className="mx-2" onClick={() => navigate("/shopList")}>Negocios</Button>
                </>
              }
              {(isClient() || isEmployee()) &&
                <><Button variant="outline-light" className="mx-2" onClick={() => navigate("/ClientAppointmentsList")}>Mis turnos</Button>
                </>
              }


              {(isOwner()) &&
                <>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/ownerPage")}>Info del Negocio</Button>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/OwnersEmployeeList")}>Empleados</Button>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/serviceList")}>Servicios</Button>
                </>
              }
              {(!isOwner()) &&
                <Button variant="outline-light" className="mx-2" onClick={() => navigate("/")}>Sobre nosotros</Button>
              }
              {(!(isClient() || isEmployee() || isOwner() || isAdmin())) &&
                <>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/registerScreen")}>Registrarse</Button>
                  <Button variant="light" className="mx-2" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
                </>
              }
              {(isClient() || isEmployee() || isOwner() || isAdmin()) &&
                <>
                  <Button variant="outline-light" className="mx-2" onClick={() => navigate("/userProfile")}>Perfil</Button>
                  <Button variant="light" className="mx-2" onClick={handleLogoutButton}>Cerrar Sesión</Button>
                </>
              }
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default UserNav;
