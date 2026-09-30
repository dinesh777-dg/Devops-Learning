- name: Check application files
  run: |
    echo "Current directory:"
    pwd

    echo "Files:"
    ls -la

    echo "Environment file:"
    cat .env.development
