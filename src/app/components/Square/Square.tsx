"use client";
import React from "react";
import styles from "./Square.module.css";
import buildingData from "../data/buildingData";

interface SquareProps {
  onBuildingSelect: (buildingId: number | null) => void;
  selectedBuildingIds: number[];
}

const Square: React.FC<SquareProps> = ({ onBuildingSelect, selectedBuildingIds }) => {
  const handleSquareClick = (id: number) => {
    onBuildingSelect(id);
  };

  const handleHouseClick = (id: number) => {
    onBuildingSelect(id);
  };

  return (
    <div className={styles.app}>
      <div className={styles.squares}>
        {buildingData.data.map((building) => (
          <div
            key={building.ID}
            className={`${styles.square} ${selectedBuildingIds.includes(building.ID) ? styles.selected : ''}`}
            onClick={() => handleSquareClick(building.ID)}
          >
            {building.NUMBER}
          </div>
        ))}
      </div>
      <div className={styles.houses}>
        {buildingData.data.map((building) => (
          <div key={building.ID} className={styles.houseContainer}>
            <div className={styles.houseLabel}>Дом №{building.NUMBER}</div>
            <div
              className={`${styles.house} ${selectedBuildingIds.includes(building.ID) ? styles.selected : ''}`}
              onClick={() => handleHouseClick(building.ID)}
            >
              {[...Array(30)].map((_, index) => (
                <div key={index} className={styles.cell} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Square;
