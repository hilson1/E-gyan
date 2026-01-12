import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />{" "}
      {/* Render the child routes here like Home, About, Login, etc. */}
      <Footer />
    </>
  );
}
