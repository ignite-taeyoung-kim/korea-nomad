#!/bin/bash

# 첫번째 아규먼트를 워크트리 이름으로 받기
ARGUMENT=$1

# 아규먼트 확인
if [ $# -eq 0 ]; then
    echo "Error: 워크트리 이름을 입력해주세요."
    echo "Usage: ./create-worktree.sh <worktree-name>"
    exit 1
fi

# git 워크트리 생성
echo "워크트리 '$WORKTREE_NAME' 생성 중..."
WORKTREE_PATH="../worktree/$ARGUMENT"
if git worktree add "$WORKTREE_PATH"; then
    echo "✓ 워크트리 생성 성공! : $WORKTREE_PATH"
    # 성공하면 현재 위치 변경
    cd "$WORKTREE_PATH" || return 1
    echo "✓ 디렉토리 이동 완료: $(pwd)"
    claude
else
    echo "✗ 워크트리 생성 실패"
    return 1
fi
