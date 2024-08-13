"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Building.module.css";

interface Premise {
  ID: number;
  UF_NUMBER: string;
  REQUESTS_OPENED_COUNT: number;
  REQUESTS_OVERDUE_COUNT: number;
}

interface Floor {
  ID: number;
  UF_NUMBER: number;
  PREMISES: Premise[];
}

interface Approach {
  ID: number;
  UF_NUMBER: number;
  FLOORS: Floor[];
}

interface Building {
  ID: number;
  NUMBER: string;
  UF_FLOOR_COUNT: number;
  FLATS: {
    APPROACHES: Approach[];
  };
  CARPLACES?: {
    FLOORS: Floor[];
  };
  PANTRIES?: {
    FLOORS: Floor[];
  };
  LOBBY?: {
    FLOORS: Floor[];
  };
  BASEMENT?: {
    PREMISES: Premise[];
  };
  ATTIC?: {
    PREMISES: Premise[];
  };
}

interface BuildingProps {
  building: Building;
}

const Building: React.FC<BuildingProps> = ({ building }) => {
  const [selectedEntrance, setSelectedEntrance] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<
    number | "все" | "Подвал" | "Чердак" | "Парковка" | null
  >(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [roomsForFloor, setRoomsForFloor] = useState<Premise[]>([]);

  const floorDropdownRef = useRef<HTMLDivElement>(null);
  const roomDropdownRef = useRef<HTMLDivElement>(null);

  const approaches: Approach[] = building.FLATS.APPROACHES;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        floorDropdownRef.current &&
        !floorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFloorDropdownOpen(false);
      }
      if (
        roomDropdownRef.current &&
        !roomDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoomDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      selectedEntrance !== null &&
      selectedFloor !== null &&
      selectedFloor !== "все"
    ) {
      const selectedApproach = approaches.find(
        (approach) => approach.UF_NUMBER === selectedEntrance
      );
      if (selectedApproach) {
        const floor = selectedApproach.FLOORS.find(
          (floor) => floor.UF_NUMBER === selectedFloor
        );
        if (floor) {
          setRoomsForFloor(floor.PREMISES);
        } else {
          setRoomsForFloor([]);
        }
      }
    } else if (selectedEntrance !== null) {
      const selectedApproach = approaches.find(
        (approach) => approach.UF_NUMBER === selectedEntrance
      );
      if (selectedApproach) {
        const allRooms = selectedApproach.FLOORS.flatMap(
          (floor) => floor.PREMISES
        );
        setRoomsForFloor(allRooms);
      }
    } else if (selectedFloor === "Подвал" && building.BASEMENT) {
      setRoomsForFloor(building.BASEMENT.PREMISES);
    } else if (selectedFloor === "Чердак" && building.ATTIC) {
      setRoomsForFloor(building.ATTIC.PREMISES);
    } else if (selectedFloor === "Парковка" && building.CARPLACES) {
      const allCarplaces = building.CARPLACES.FLOORS.flatMap(
        (floor) => floor.PREMISES
      );
      setRoomsForFloor(allCarplaces);
    } else if (selectedFloor !== null && selectedFloor !== "все") {
      const allRooms = approaches.flatMap((approach) =>
        approach.FLOORS.filter(
          (floor) => floor.UF_NUMBER === selectedFloor
        ).flatMap((floor) => floor.PREMISES)
      );
      setRoomsForFloor(allRooms);
    } else if (selectedFloor === "все") {
      const allRooms = approaches.flatMap((approach) =>
        approach.FLOORS.flatMap((floor) => floor.PREMISES)
      );
      setRoomsForFloor(allRooms);
    } else {
      setRoomsForFloor([]);
    }
  }, [selectedFloor, selectedEntrance, approaches, building]);

  const handleEntranceChange = (entrance: number) => {
    if (selectedEntrance === entrance) {
      setSelectedEntrance(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
      setRoomsForFloor([]);
    } else {
      setSelectedEntrance(entrance);
      setSelectedFloor("все");
      setSelectedRoom(null);
    }
  };

  const handleFloorChange = (
    floor: number | "Подвал" | "Чердак" | "Парковка" | "все"
  ) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
    setIsFloorDropdownOpen(false);
  };

  const handleRoomChange = (room: number | null) => {
    setSelectedRoom(room);
    setIsRoomDropdownOpen(false);
  };

  const isCellSelected = (
    entrance: number | null,
    floor: number | "Подвал" | "Чердак" | "Парковка",
    room: number
  ) => {
    if (selectedEntrance !== null && selectedEntrance !== entrance)
      return false;
    if (
      selectedFloor !== "все" &&
      selectedFloor !== null &&
      selectedFloor !== floor
    )
      return false;
    if (selectedRoom !== null && selectedRoom !== room) return false;
    return (
      selectedEntrance !== null ||
      selectedFloor !== null ||
      selectedRoom !== null
    );
  };

  const handleCellClick = (
    entrance: number | null,
    floor: number | "Подвал" | "Чердак" | "Парковка",
    room: number
  ) => {
    if (
      selectedEntrance === entrance &&
      selectedFloor === floor &&
      selectedRoom === room
    ) {
      // Если пользователь нажимает на уже выбранную ячейку, сбросить выделение
      setSelectedEntrance(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
    } else {
      // В противном случае выделить новую ячейку
      setSelectedEntrance(entrance);
      setSelectedFloor(floor);
      setSelectedRoom(room);
    }
  };

  const handleFloorLabelClick = (
    floor: number | "Подвал" | "Чердак" | "Парковка"
  ) => {
    if (selectedFloor === floor) {
      setSelectedFloor(null);
      setSelectedEntrance(null);
      setSelectedRoom(null);
      setRoomsForFloor([]);
    } else {
      setSelectedEntrance(null);
      setSelectedFloor(floor);
      setSelectedRoom(null);
    }
  };

  const generateCellsForApproach = (approach: Approach) => {
    return approach.FLOORS.slice()
      .reverse()
      .map((floor) => (
        <div
          key={`floor-${approach.UF_NUMBER}-${floor.UF_NUMBER}`}
          style={{ display: "flex", gap: "3px" }}
        >
          {floor.PREMISES.map((premise) => {
            const isSelected = isCellSelected(
              approach.UF_NUMBER,
              floor.UF_NUMBER,
              premise.ID
            );
            const isOpenGreater =
              premise.REQUESTS_OPENED_COUNT > premise.REQUESTS_OVERDUE_COUNT;
            const isOverdueGreater =
              premise.REQUESTS_OPENED_COUNT < premise.REQUESTS_OVERDUE_COUNT;
            const noRequests =
              premise.REQUESTS_OPENED_COUNT === 0 &&
              premise.REQUESTS_OVERDUE_COUNT === 0;
            const cellClass = `${styles.cell} ${
              isSelected ? styles.selected : ""
            } ${
              !isSelected && !noRequests && isOpenGreater
                ? styles.openGreater
                : ""
            } ${
              !isSelected && !noRequests && isOverdueGreater
                ? styles.overdueGreater
                : ""
            }`;
            return (
              <div
                key={`cell-${floor.UF_NUMBER}-${premise.ID}`}
                onClick={() =>
                  handleCellClick(
                    approach.UF_NUMBER,
                    floor.UF_NUMBER,
                    premise.ID
                  )
                }
                className={cellClass}
              >
                {premise.UF_NUMBER}
              </div>
            );
          })}
        </div>
      ));
  };

  const generateFloorLabels = () => {
    const maxFloors = Math.max(
      ...approaches.flatMap((approach) =>
        approach.FLOORS.map((floor) => floor.UF_NUMBER)
      )
    );

    const regularFloors = Array.from(
      { length: maxFloors },
      (_, index) => maxFloors - index
    );

    return (
      <>
        <div
          key={`floor-label-attic`}
          className={`${styles.floorLabel} ${
            selectedFloor === "Чердак" ? styles.selectedFloor : ""
          }`}
          onClick={() => handleFloorLabelClick("Чердак")}
        >
          Чердак
        </div>
        {regularFloors.map((floorNumber) => (
          <div
            key={`floor-label-${floorNumber}`}
            className={`${styles.floorLabel} ${
              selectedFloor === floorNumber ? styles.selectedFloor : ""
            }`}
            onClick={() => handleFloorLabelClick(floorNumber)}
          >
            {floorNumber}
          </div>
        ))}
        <div>
          <div
            key={`floor-label-basement`}
            className={`${styles.floorLabel} ${
              selectedFloor === "Подвал" ? styles.selectedFloor : ""
            }`}
            onClick={() => handleFloorLabelClick("Подвал")}
          >
            Подвал
          </div>
          <div
            key={`floor-label-carplace`}
            className={`${styles.floorLabel} ${
              selectedFloor === "Парковка" ? styles.selectedFloor : ""
            }`}
            onClick={() => handleFloorLabelClick("Парковка")}
          >
            Парковка
          </div>
        </div>
      </>
    );
  };

  const generateAdditionalStructures = (
    structureName: string,
    floors: Floor[] | undefined,
    structureType: "Подвал" | "Чердак" | "Парковка"
  ) => {
    if (!floors) return null;
    return (
      <div className={styles.additionalStructure}>
        {floors.map((floor, index) => (
          <div
            key={`additional-${structureName}-${index}`}
            style={{ display: "flex", gap: "3px" }}
          >
            {floor.PREMISES.map((premise) => {
              const isSelected = isCellSelected(
                null,
                structureType,
                premise.ID
              );
              const isOpenGreater =
                premise.REQUESTS_OPENED_COUNT > premise.REQUESTS_OVERDUE_COUNT;
              const isOverdueGreater =
                premise.REQUESTS_OPENED_COUNT < premise.REQUESTS_OVERDUE_COUNT;
              const noRequests =
                premise.REQUESTS_OPENED_COUNT === 0 &&
                premise.REQUESTS_OVERDUE_COUNT === 0;
              const cellClass = `${styles.cell} ${
                isSelected ? styles.selected : ""
              } ${
                !isSelected && !noRequests && isOpenGreater
                  ? styles.openGreater
                  : ""
              } ${
                !isSelected && !noRequests && isOverdueGreater
                  ? styles.overdueGreater
                  : ""
              }`;
              return (
                <div
                  key={`additional-cell-${structureName}-${premise.ID}`}
                  onClick={() =>
                    handleCellClick(null, structureType, premise.ID)
                  }
                  className={cellClass}
                  style={{ width: "100%" }} // Занять всю ширину строки
                >
                  {premise.UF_NUMBER}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const generateBasementAndAttic = (
    structureName: string,
    premises: Premise[] | undefined,
    structureType: "Подвал" | "Чердак"
  ) => {
    if (!premises) return null;
    return (
      <div className={styles.additionalStructure}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {premises.map((premise) => {
            const isSelected = isCellSelected(null, structureType, premise.ID);
            const isOpenGreater =
              premise.REQUESTS_OPENED_COUNT > premise.REQUESTS_OVERDUE_COUNT;
            const isOverdueGreater =
              premise.REQUESTS_OPENED_COUNT < premise.REQUESTS_OVERDUE_COUNT;
            const noRequests =
              premise.REQUESTS_OPENED_COUNT === 0 &&
              premise.REQUESTS_OVERDUE_COUNT === 0;
            const cellClass = `${styles.cell} ${
              isSelected ? styles.selected : ""
            } ${
              !isSelected && !noRequests && isOpenGreater
                ? styles.openGreater
                : ""
            } ${
              !isSelected && !noRequests && isOverdueGreater
                ? styles.overdueGreater
                : ""
            }`;
            return (
              <div
                key={`additional-cell-${structureName}-${premise.ID}`}
                onClick={() => handleCellClick(null, structureType, premise.ID)}
                className={cellClass}
                style={{ width: "100%" }} // Занять всю ширину строки
              >
                {premise.UF_NUMBER}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 style={{marginBottom: "30px"}}>Дом №{building.NUMBER}</h2>
      {(isFloorDropdownOpen || isRoomDropdownOpen) && (
        <div
          className={styles.overlay}
          onClick={() => {
            setIsFloorDropdownOpen(false);
            setIsRoomDropdownOpen(false);
          }}
        ></div>
      )}
      <div className={styles.filters}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            marginRight: "20px",
          }}
        >
          <label htmlFor="room-select" style={{ marginRight: "5px" }}>
            Подъезд:
          </label>
          {approaches.map((approach) => (
            <button
              key={approach.ID}
              onClick={() => handleEntranceChange(approach.UF_NUMBER)}
              className={`${styles.filterButton} ${
                selectedEntrance === approach.UF_NUMBER
                  ? styles.selectedEntrance
                  : styles.defaultButton
              }`}
            >
              {approach.UF_NUMBER}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            marginRight: "20px",
          }}
        >
          <label htmlFor="room-select" style={{ marginRight: "5px" }}>
            Этаж:
          </label>
          <div
            className={styles.floorDropdown}
            onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}
            ref={floorDropdownRef}
          >
            {selectedFloor === "все"
              ? "Все этажи"
              : selectedFloor || (
                  <div style={{ display: "flex" }}>
                    <div>Этаж</div>
                    <div className={styles.arrow}></div>
                  </div>
                )}
            <div
              className={styles.floorDropdownList}
              style={{ display: isFloorDropdownOpen ? "block" : "none" }}
            >
              <div
                onClick={() => handleFloorChange("все")}
                className={`${styles.floorDropdownItem} ${
                  selectedFloor === "все" ? styles.selected : ""
                }`}
              >
                Все этажи
              </div>
              {generateFloorLabels()}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label htmlFor="room-select" style={{ marginRight: "5px" }}>
            Помещение:
          </label>
          <div
            ref={roomDropdownRef}
            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            className={styles.roomDropdown}
          >
            {selectedRoom === null ? (
              <div style={{ display: "flex" }}>
                <div>Все</div>
                <div className={styles.arrow}></div>
              </div>
            ) : (
              selectedRoom
            )}
            <div
              className={styles.roomDropdownList}
              style={{ display: isRoomDropdownOpen ? "block" : "none" }}
            >
              <div
                onClick={() => handleRoomChange(null)}
                className={styles.roomDropdownItem}
              >
                Все помещения
              </div>
              {roomsForFloor.map((room) => (
                <div
                  key={room.ID}
                  onClick={() => handleRoomChange(room.ID)}
                  className={`${styles.roomDropdownItem} ${
                    selectedRoom === room.ID ? styles.selected : ""
                  }`}
                >
                  {room.UF_NUMBER}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            marginRight: "18px",
            paddingTop: "30px",
            paddingBlockEnd: "30px",
          }}
          className={styles.floorLabelsColumn}
        >
          {generateFloorLabels()}
        </div>
        <div className={styles.buildingSchema} style={{ display: "block" }}>
          <div className={styles.approachLabels}>
            {approaches.map((approach) => (
              <div
                key={approach.ID}
                onClick={() => handleEntranceChange(approach.UF_NUMBER)}
                className={styles.approachLabel}
              >
                Подъезд №{approach.UF_NUMBER}
              </div>
            ))}
          </div>
          <div style={{ width: "100%", marginBottom: "3px" }}>
            {generateBasementAndAttic(
              "Чердак",
              building.ATTIC?.PREMISES,
              "Чердак"
            )}
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {approaches.map((approach) => (
              <div key={approach.ID} className={styles.building}>
                {generateCellsForApproach(approach)}
              </div>
            ))}
          </div>
          <div style={{ width: "100%", marginTop: "3px" }}>
            <div style={{ marginBottom: "3px" }}>
              {generateBasementAndAttic(
                "Подвал",
                building.BASEMENT?.PREMISES,
                "Подвал"
              )}
            </div>

            {generateAdditionalStructures(
              "Парковка",
              building.CARPLACES?.FLOORS,
              "Парковка"
            )}
          </div>
        </div>
      </div>
      {/* <div style={{ width: "300px" }}>
        {generateAdditionalStructures(
          "Парковка",
          building.CARPLACES?.FLOORS,
          "Парковка"
        )}
        {generateBasementAndAttic(
          "Подвал",
          building.BASEMENT?.PREMISES,
          "Подвал"
        )}
        {generateBasementAndAttic("Чердак", building.ATTIC?.PREMISES, "Чердак")}
      </div> */}
    </div>
  );
};

export default Building;
