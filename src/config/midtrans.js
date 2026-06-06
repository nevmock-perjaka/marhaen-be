import Midtrans from "midtrans-client";
import { decrypt } from "../utils/hash.js";

const midtransSnap = new Midtrans.Snap({
	isProduction: process.env.NODE_ENV === "production",
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const midtransCoreApi = new Midtrans.CoreApi({
	isProduction: process.env.NODE_ENV === "production",
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const userMidtransConfig = (is_production, secret_key, client_key) => {
	return new Midtrans.Snap({
		isProduction: is_production,
		serverKey: decrypt(secret_key),
		clientKey: decrypt(client_key),
	});
};

export { midtransSnap, midtransCoreApi, userMidtransConfig };
