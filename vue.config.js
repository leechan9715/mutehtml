const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    productionSourceMap: false,
    parallel: false,
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        // 개발 서버 설정
        proxy: {
            // '/oauth2.0'으로 시작하는 모든 요청은 프록시를 통해 처리됩니다.
            '/oauth2.0': {
                target: 'https://nid.naver.com', // 요청을 보낼 대상 서버의 주소
                changeOrigin: true, // 대상 서버의 원본을 변경하여 요청을 보냅니다.
                pathRewrite: { '^/oauth2.0': '/oauth2.0' } // 요청 경로를 재작성합니다.
            },
            '/api': {
                // target: 'https://junotheweb.dothome.co.kr/',
                target: 'https://muteapp.dothome.co.kr/',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },

                // 핵심: 원격 도메인 쿠키를 localhost에서 저장 가능하게
                cookieDomainRewrite: 'localhost',
                // 필요시 Path도 강제 (세션 경로 꼬일 때만)
                // cookiePathRewrite: { '*': '/' },

                timeout: 10000,
                proxyTimeout: 10000,
                logLevel: 'debug', // 개발 중에는 debug, 배포 시에는 info/silent로 변경 권장
                ws: false // WebSocket 비활성화, 필요시 true로 변경
            }
        },
        client: {
            // 클라이언트 측 오버레이 설정
            // overlay: {
            //     warnings: false, // 경고 메시지를 오버레이에 표시하지 않음
            //     errors: false // 에러 메시지를 오버레이에 표시하지 않음
            // }

            // 또는 전체 오버레이를 비활성화
            overlay: false
        }
    }
});

