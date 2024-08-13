"use client";
import React, { useState } from "react";
import Square from "../Square/Square"; // Импортируем компонент Square
import Building from "../Building/Building"; // Импортируем компонент Building
import buildingData from "../data/buildingData"; // Импортируем данные

const ResidentialComplex: React.FC = () => {
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);

  const handleBuildingSelect = (buildingId: number | null) => {
    if (buildingId === null) return;

    setSelectedBuildingIds((prevSelectedBuildingIds) => {
      if (prevSelectedBuildingIds.includes(buildingId)) {
        return prevSelectedBuildingIds.filter((id) => id !== buildingId);
      } else {
        return [...prevSelectedBuildingIds, buildingId];
      }
    });
  };

  return (
    <div style={{backgroundColor: "white", width: "100%"}}>
      <h1 style={{marginLeft: "20px", marginTop: "20px"}}>Жилой Комплекс</h1>
      <Square onBuildingSelect={handleBuildingSelect} selectedBuildingIds={selectedBuildingIds} />
      <div>
        {selectedBuildingIds.length > 0 ? (
          selectedBuildingIds.map((buildingId) => (
            <Building
              key={buildingId}
              building={buildingData.data.find(b => b.ID === buildingId)!}
            />
          ))
        ) : (
          <p style={{marginLeft: "20px", marginTop: "20px"}}>Пожалуйста, выберите здание для отображения деталей.</p>
        )}
      </div>
    </div>
  );
};

export default ResidentialComplex;
