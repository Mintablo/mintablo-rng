import DefaultRouter from "./routers";
import { getNewSeed, getResult, verifyResult } from "./api";

const router = DefaultRouter();

router.get("/new-seed", getNewSeed);
router.get("/result", getResult);
router.get("/verify", verifyResult);

export default router;
