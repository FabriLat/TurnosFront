import { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import ServiceCard from "../serviceCard/ServiceCard";
import Spiner from "../spiner/Spiner";
import "./serviceList.css";
import { Button } from "react-bootstrap";
import useValidateUser from "../hookCustom/useValidateUser";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

const ServiceList = () => {
  const { shopId, user } = useContext(AuthenticationContext);

  const ownerClientShopId = shopId || (user?.role === 'Owner' ? user.shopId : null);
  const { isClient, isOwner } = useValidateUser();
  const navegate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el Modal de éxito en la eliminación
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [ownerClientShopId]);

  const shopName = services.map(item => item.shopName)[0];

  const fetchServices = async () => {
    console.log(ownerClientShopId);
    try {
      const response = await fetch(`https://localhost:7276/api/Service/GetAllServicesByShopWithNameShop/${ownerClientShopId}`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      if (!response.ok) {
        throw new Error("Error in obtaining Services");
      }
      const data = await response.json();
      setServices(data);
      setLoading(false);
    }
    catch (error) {
      console.error("Error:", error)
    }
  };

  const handleButtonAddService = () => {
    navegate('/ServiceForm');
  }

  const removeService = (id) => {
    setServices((prevService) => prevService.filter((s) => s.serviceId !== id));
    setShowSuccessModal(true); // Mostrar el modal de éxito después de eliminar
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false); // Cerrar modal de éxito
  }

  return (
    <div>
      {loading ? (
        <Spiner />
      ) : (
        <div className="outer-container-service-list">
          <div className="shop-list-container">

            {(isClient()) && (
              <div className="title-service">
                <h1 className="service-title">
                  Selecciona un servicio de {shopName}:
                </h1>
              </div>
            )}

            {(isOwner()) && (
              <div className="title-service">
                <h1 className="service-title">
                  Listado de Servicios:
                </h1>
                <Button style={{ backgroundColor: '#6d21dd', marginBottom:'2%' }} onClick={handleButtonAddService}>
                  Agregar nuevo Servicio
                </Button>
              </div>
            )}

            <div className="mt-4 card-service">
              {services.map((s) => (
                <ServiceCard
                  key={s.serviceId}
                  nameService={s.serviceName}
                  description={s.description}
                  duration={s.duration}
                  price={s.price}
                  idService={s.serviceId}
                  onRemoveService={removeService}
                />
              ))}
            </div>
          </div>
        </div>
      )}

     
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>¡Servicio Eliminado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El servicio ha sido eliminado correctamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceList;
