import { register } from "node:module";

// 테스트 파일마다 모듈 해석 훅을 등록한다. package.json test 스크립트의 --import 대상.
register("./ts-test-hooks.mjs", import.meta.url);
