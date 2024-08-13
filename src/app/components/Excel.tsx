"use client";
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const jsonData = {
  data: [
    {
      ID: 1,
      UF_COMMENT: "Перегорела лампочка на этаже",
      DATE_CREATE: "2024-10-10 10:00:00",
      CATEGORY: {
        ID: 12,
        NAME: "Бесплатные заявки",
        BACKGROUND: "#FFC107",
        COLOR: "#FFFFFF",
      },
      STAGE: {
        ID: "C12:NEW",
        NAME: "Новая заявка",
        COLOR: "#2FC6F6",
      },
      CONTACT: {
        ID: 12,
        NAME: "Пирогов Семен Петрович",
        PHONE: "79251234567",
      },
      ASSIGNED_BY: {
        ID: 12,
        NAME: "Пирогов Семен Петрович",
      },
    },
    // Добавьте другие записи, если необходимо...
  ],
};

const App = () => {
  const [fileUrl, setFileUrl] = useState("");

  const createAndDownloadExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Добавляем заголовки
    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "UF_COMMENT", key: "UF_COMMENT", width: 30 },
      { header: "DATE_CREATE", key: "DATE_CREATE", width: 20 },
      { header: "CATEGORY_ID", key: "CATEGORY_ID", width: 10 },
      { header: "CATEGORY_NAME", key: "CATEGORY_NAME", width: 30 },
      { header: "CATEGORY_BACKGROUND", key: "CATEGORY_BACKGROUND", width: 15 },
      { header: "CATEGORY_COLOR", key: "CATEGORY_COLOR", width: 15 },
      { header: "STAGE_ID", key: "STAGE_ID", width: 15 },
      { header: "STAGE_NAME", key: "STAGE_NAME", width: 30 },
      { header: "STAGE_COLOR", key: "STAGE_COLOR", width: 15 },
      { header: "CONTACT_ID", key: "CONTACT_ID", width: 10 },
      { header: "CONTACT_NAME", key: "CONTACT_NAME", width: 30 },
      { header: "CONTACT_PHONE", key: "CONTACT_PHONE", width: 15 },
      { header: "ASSIGNED_BY_ID", key: "ASSIGNED_BY_ID", width: 10 },
      { header: "ASSIGNED_BY_NAME", key: "ASSIGNED_BY_NAME", width: 30 },
    ];

    // Добавляем строки
    jsonData.data.forEach((entry) => {
      worksheet.addRow({
        ID: entry.ID,
        UF_COMMENT: entry.UF_COMMENT,
        DATE_CREATE: entry.DATE_CREATE,
        CATEGORY_ID: entry.CATEGORY.ID,
        CATEGORY_NAME: entry.CATEGORY.NAME,
        CATEGORY_BACKGROUND: entry.CATEGORY.BACKGROUND,
        CATEGORY_COLOR: entry.CATEGORY.COLOR,
        STAGE_ID: entry.STAGE.ID,
        STAGE_NAME: entry.STAGE.NAME,
        STAGE_COLOR: entry.STAGE.COLOR,
        CONTACT_ID: entry.CONTACT.ID,
        CONTACT_NAME: entry.CONTACT.NAME,
        CONTACT_PHONE: entry.CONTACT.PHONE,
        ASSIGNED_BY_ID: entry.ASSIGNED_BY.ID,
        ASSIGNED_BY_NAME: entry.ASSIGNED_BY.NAME,
      });
    });

    // Генерация файла и его сохранение
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      setFileUrl(url);

      saveAs(blob, "data.xlsx");
    });
  };

  return (
    <div>
      <h1>Создание Excel из JSON</h1>
      <button onClick={createAndDownloadExcelFile}>
        Создать и скачать Excel файл
      </button>
      {fileUrl && (
        <div>
          <p>Ваш документ готов: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default App;
