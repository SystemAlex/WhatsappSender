export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("WASenderDB", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("attachments")) {
        db.createObjectStore("attachments");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveAttachmentDB = async (index: number, file: File | null) => {
  const db = await openDB();
  const tx = db.transaction("attachments", "readwrite");
  const store = tx.objectStore("attachments");
  if (file) {
    store.put(file, index);
  } else {
    store.delete(index);
  }
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
};

export const getAttachmentsDB = async (): Promise<(File | null)[]> => {
  const db = await openDB();
  const tx = db.transaction("attachments", "readonly");
  const store = tx.objectStore("attachments");
  const files: (File | null)[] = [null, null, null];

  return new Promise((resolve) => {
    const request = store.openCursor();
    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
        .result;
      if (cursor) {
        files[cursor.key as number] = cursor.value;
        cursor.continue();
      } else {
        resolve(files);
      }
    };
  });
};

export const clearAttachmentsDB = async () => {
  const db = await openDB();
  const tx = db.transaction("attachments", "readwrite");
  tx.objectStore("attachments").clear();
};
