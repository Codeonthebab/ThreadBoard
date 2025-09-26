from app import create_app

# 앱 함수 호출, Flask 앱 생성
app = create_app()

# 로컬을 위한 EndPoint 보기 위한 코드 추가
with app.app_context():
    print("--- 등록된 URL 규칙 ---")
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Methods: {','.join(rule.methods)}, URL: {rule.rule}")
    print("----------------------")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)