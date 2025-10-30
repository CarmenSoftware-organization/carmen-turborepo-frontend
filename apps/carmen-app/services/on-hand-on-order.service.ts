import { backendApi } from "@/lib/backend-api";
import axios from "axios";

export const getOnHandOnOrderService = async (
  token: string,
  buCode: string,
  locationId: string,
  productId: string
) => {
  if (!token || !buCode || !locationId || !productId) {
    console.error("Authorization token, tenant ID, location ID, and product ID are required");
    return null;
  }

  try {
    const API_URL = `${backendApi}/api/${buCode}/locations/${locationId}/product/${productId}/inventory`;
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching on-hand-on-order:", error);
    throw error;
  }
};
