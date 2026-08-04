import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";

// tsconfig의 "@/*" -> "./src/*" 를 테스트에서도 똑같이 해석한다.
const SRC_URL = pathToFileURL(`${process.cwd()}/src/`).href;

// node --test는 확장자가 없는 상대 경로를 해석하지 못한다.
// 소스 코드는 번들러 기준(확장자 없음)으로 두고, 테스트 실행 시에만 .ts / index.ts를 붙여 찾는다.
export async function resolve(specifier, context, nextResolve) {
  const isAlias = specifier.startsWith("@/");
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");

  if (
    (isAlias || isRelative) &&
    !specifier.endsWith(".ts") &&
    context.parentURL
  ) {
    const base = isAlias
      ? new URL(specifier.slice(2), SRC_URL).href
      : new URL(specifier, context.parentURL).href;
    const candidate = [`${base}.ts`, `${base}/index.ts`].find((path) =>
      existsSync(fileURLToPath(path)),
    );

    if (candidate !== undefined) {
      return nextResolve(candidate, context);
    }
  }

  return nextResolve(specifier, context);
}
