import React from "react";
import { useTranslation } from "react-i18next";

const Root = () => {
  const { t } = useTranslation();

  return <div>{t("WELCOME")}</div>;
};

export default Root;
