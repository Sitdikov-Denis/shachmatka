"use client";
import React from "react";
import Building from "./Building";
import buildingData from "../data/buildingData";

const BuildingsList: React.FC = () => {
  return (
    <div>
      {buildingData.data.map((building) => (
        <Building key={building.ID} building={building} />
      ))}
    </div>
  );
};

export default BuildingsList;
