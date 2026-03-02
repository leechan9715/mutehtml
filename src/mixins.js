import axios from 'axios';

export default {
    methods: {
        // $api 메서드는 비동기적으로 HTTP 요청을 수행합니다.
        // url: 요청을 보낼 대상 URL
        // method: HTTP 요청 메서드 (GET, POST, 등)
        // data: 요청에 포함할 데이터 (POST, PUT 등에서 사용)
        async $api(url, method, data) {
            return (
                // axios를 사용하여 HTTP 요청을 보냅니다.
                (
                    await axios({
                        method: method, // 요청 메서드 설정
                        url, // 요청 URL 설정
                        data // 요청 데이터 설정
                    }).catch((e) => {
                        // 요청 중 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
                        console.log(e);
                    })
                ).data
            ); // 요청이 성공하면 응답 데이터(data)를 반환합니다.
        }
    }
};
