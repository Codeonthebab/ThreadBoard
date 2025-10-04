/* HSL 색상(파스텔 톤으로 쓰기 쉬워)으로 쓰레드 별 고유 ID 별 색상 부여
**** HSL 색상 코드 문자열 ****
=> @returns : HSL 색상 코드 문자열 부여
=> @param id : 색상 생성 기준의 문자열 ID로 사용
*/

export const getColorByAuthorId = (id : string | null | undefined) : string => {

    // id 기본 값 정의를 위해서 유효하지 않은 경우도 if 문으로 분기점 생성
    // 밑에 for 문에서 id : '정의하지 않음' 오류를 막을 수 있음
    if (!id) {
        return 'hsl(0, 0%, 90%)';
    }

    // 문자열 기반으로 간단 해시값 생성
    let hash = 0;
    for (let i =0; i<id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 위에서 생성한 임의 해시값을 0-359 사이 값을 기반으로 hue 생성
    const hue = Math.abs(hash % 360);

    // 파스텔톤 유지를 위한 채도, 명도 생성 (*기준 값 : %)
    const saturation = 70;
    const lightness = 85;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};