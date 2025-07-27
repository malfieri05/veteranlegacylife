#!/bin/bash

# Script to switch between GitHub accounts

case "$1" in
    "personal"|"ls5986")
        git config --global user.name "ls5986"
        git config --global user.email "ls5986@github.com"
        echo "Switched to personal account (ls5986)"
        echo "SSH Host: github-ls5986"
        ;;
    "work"|"lstevensTRA")
        git config --global user.name "lstevensTRA"
        git config --global user.email "lstevensTRA@github.com"
        echo "Switched to work account (lstevensTRA)"
        echo "SSH Host: github-work"
        ;;
    *)
        echo "Usage: ./switch-git-account.sh [personal|work]"
        echo "  personal - Switch to ls5986 account"
        echo "  work     - Switch to lstevensTRA account"
        ;;
esac 