import numeral from "numeral";
import _ from "lodash";

import NumberEase from "./NumberEase";

export { NumberEase };
export const formatNumber = v => numeral(v).format();
export const formatMoney = v => numeral(v).format("$0,0.00");
export const formatDecimal = v => numeral(v).format("0.00");

export const calcSalesHistory = (record, week) => {
  const { salesHistory, salesLastWeek: salesThisWeek } = record;
  record.salesHistory = salesHistory || [];

  if (!_.isFinite(salesThisWeek) || salesThisWeek <= 0) {
    return record;
  }

  record.salesHistory.push({
    sales: salesThisWeek,
    week
  });
  
  return record;
};
