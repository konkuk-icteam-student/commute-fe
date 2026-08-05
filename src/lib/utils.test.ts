import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { cn } = (await import(
  new URL("./utils.ts", import.meta.url).href
)) as typeof import("./utils");

describe("cn", () => {
  it("joins class names", () => {
    assert.equal(cn("flex", "items-center"), "flex items-center");
  });

  it("drops falsy values", () => {
    assert.equal(cn("flex", false, null, undefined, ""), "flex");
  });

  it("keeps only the last class when the same property collides", () => {
    assert.equal(cn("bg-white", "bg-black"), "bg-black");
    assert.equal(cn("px-2", "px-4"), "px-4");
  });

  // schedule-week-nav의 비활성 버튼에서 실제로 부딪히던 조합.
  it("lets a conditional class override the base class", () => {
    assert.equal(
      cn("cursor-pointer rounded-full", true && "cursor-not-allowed"),
      "rounded-full cursor-not-allowed",
    );
    assert.equal(
      cn("cursor-pointer rounded-full", false && "cursor-not-allowed"),
      "cursor-pointer rounded-full",
    );
  });

  // 컴포넌트가 받은 className으로 기본 스타일을 덮을 수 있어야 한다.
  it("lets a caller className override the component default", () => {
    assert.equal(
      cn("bg-white text-sm", "bg-[#2076FF]"),
      "text-sm bg-[#2076FF]",
    );
  });

  // 슬롯 칸처럼 상태별 클래스가 통째로 갈아 끼워지는 경우.
  it("keeps unrelated classes while replacing the colliding one", () => {
    assert.equal(
      cn("flex h-7 w-full rounded-sm", "border border-[#DDD9D9] bg-white"),
      "flex h-7 w-full rounded-sm border border-[#DDD9D9] bg-white",
    );
  });

  it("accepts arrays and objects", () => {
    assert.equal(cn(["flex", "gap-2"]), "flex gap-2");
    assert.equal(cn({ flex: true, hidden: false }), "flex");
  });
});
