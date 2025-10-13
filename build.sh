#!/bin/sh
REPO_NAME="WEB5_6_OneTop_FE"

cd ../

mkdir output

cp -R ./${REPO_NAME}/* ./output
cp -R ./output ./${REPO_NAME}/