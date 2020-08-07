
export default (currentTimeMilis) => {
    console.log(currentTimeMilis)
    const date = new Date(parseInt(currentTimeMilis, 10));
    console.log(date);
    return date.toUTCString();
}