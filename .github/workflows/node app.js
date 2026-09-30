- name: Run Node application
  run: |
    node app.js > app.log 2>&1 &

    sleep 5

    echo "===== Application Log ====="
    cat app.log

    echo "===== Port Check ====="
    ss -lntp || true

    echo "===== Health Check ====="
    curl -v http://localhost:8080/health
