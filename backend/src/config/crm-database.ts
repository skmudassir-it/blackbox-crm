import mongoose from "mongoose";

/**
 * CRM database connection — uses the same MongoDB server but a separate
 * database 'blackbox_crm'. All CRM models must use this connection.
 */
export const crmConnection = mongoose.connection.useDb("blackbox_crm");

console.log("✅ CRM database connection established — blackbox_crm");
