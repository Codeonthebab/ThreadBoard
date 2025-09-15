from app import create_app

# 앱 함수 호출, Flask 앱 생성
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)