import { getStorage, ref, uploadBytesResumable, getDownloadURL, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "./client";

let storage: FirebaseStorage | undefined;

function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}

export function uploadImageFile(
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storageRef = ref(
    getFirebaseStorage(),
    `product-images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFilename}`,
  );

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(progress);
        }
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      },
    );
  });
}
