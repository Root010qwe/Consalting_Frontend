import { useState } from "react";
import Header from "./components/Header";
import Breadcrumbs from "./components/BreadCrumbs";
import ServicePage from "./pages/DescriptionPage";
import ServicesListPage from "./pages/ServicesPage";
import { Route, Routes } from "react-router-dom";
import { T_Service } from "./modules/types.ts";
import { Container, Row } from "reactstrap";
import HomePage from "./pages/HomePage";
import "./styles.css";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import ForbiddenPage from "./pages/403/ForbiddenPage.tsx";
import NotFoundPage from "./pages/404/NotFoundPage.tsx";
import RequestPage from "./pages/RequestPage";
import RequestsPage from "./pages/RequestsPage";
import ModerServicesPage from "./pages/ModerServicesPage";
import ServicesEditPage from './pages/ServicesEditPage';
import ServiceAddPage from './pages/ServiceAddPage';
import ModerRequestsPage from './pages/ModerRequestsPage'
function App() {
  const [services, setServices] = useState<T_Service[]>([]);

  const [selectedService, setSelectedService] = useState<T_Service | null>(
    null
  );

  const [isMock, setIsMock] = useState(false);

  const [serviceName, setServiceName] = useState<string>("");

  return (
    <div>
      {/* <BrowserRouter basename="/consalting_frontend/"></BrowserRouter> */}
      <Header />
      <Container className="pt-4">
        <Row className="mb-3">
          <Breadcrumbs/>
        </Row>
        <Row>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/request/:id" element={<RequestPage />} />
            <Route path="/requests/" element={<RequestsPage />} />
            <Route path="/moder-services/" element={<ModerServicesPage />} />
            <Route path="/moder/services/edit/:id" element={<ServicesEditPage />} />
            <Route path="/moder/services/add/" element={<ServiceAddPage />} />
            <Route path="/moder-requests/" element={<ModerRequestsPage />} />
            <Route
              path="/services/"
              element={
                <ServicesListPage
                  services={services}
                  setServices={setServices}
                  isMock={isMock}
                  setIsMock={setIsMock}
                  serviceName={serviceName}
                  setServiceName={setServiceName}
                />
              }
            />
            <Route
              path="/services/:id"
              element={
                <ServicePage
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  isMock={isMock}
                  setIsMock={setIsMock}
                />
              }
            />
          </Routes>
        </Row>
      </Container>
    </div>
  );
}

export default App;
