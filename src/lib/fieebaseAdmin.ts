import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

// 실제 배포 환경에서 어떻게 설정할까 생각해봐야함!!!

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
