/**
 * @description 이미지 파일을 프리뷰할수 있는 형식으로 변경하고 src를 리턴합니다.
 * @param imageFile 이미지 파일
 * @returns string | null
 */

export const getFilePreview = (imageFile: File) => {
  if (imageFile) {
    const reader = new FileReader();

    reader.onloadend = () => {
      return reader.result as string;
    };

    reader.readAsDataURL(imageFile);
  } else {
    return null;
  }
};
