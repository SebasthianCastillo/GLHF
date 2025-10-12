import { useState } from "react";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const useFilePdfDownload = () => {
  const [isLoadingPdfDownload, setIsLoadingPdfDownload] = useState(false);

  const downloadProductListPdf = async (categoryId: string) => {
    setIsLoadingPdfDownload(true);
    try {
      const uri = await FileSystem.downloadAsync(
        `${API_URL}/generate-pdf/${categoryId}`,
        FileSystem.documentDirectory + `report-${categoryId}.pdf`
      );
      await saveFile(
        uri,
        `report-${categoryId}.pdf`,
        uri.headers["Content-Type"]
      );
      Alert.alert("✅ Success", `report-${categoryId}.pdf Downloaded`);
    } catch (err) {
      console.error("❌ PDF download failed", err);
      Alert.alert("Error", "Failed to download PDF");
    } finally {
      setIsLoadingPdfDownload(false);
    }
  };

  const saveFile = async (
    uri: FileSystem.FileSystemDownloadResult,
    filename: string,
    mimetype: string
  ) => {
    try {
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const newFileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              filename,
              mimetype
            );
          await FileSystem.writeAsStringAsync(newFileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } else await shareAsync(uri.uri);
      } else await shareAsync(uri.uri);
    } catch (err) {
      console.error("❌ File save failed", err);
      Alert.alert("Error", "Failed to save file");
    }
  };

  return { downloadProductListPdf, isLoadingPdfDownload };
};
