import Image from "next/image";
import type { Organization } from "@/apis/organization";
import type { RoleCode } from "@/apis/token-storage";
import icCheck from "@/assets/icons/admin-member/ic_check.svg";
import { Button, Input } from "@/components/ui";
import { ROLE_OPTIONS } from "@/features/auth/constants/role-options";

type InputState = "default" | "active" | "error" | "success";

interface MemberInfoSectionProps {
  roleCode: RoleCode;
  onRoleCodeChange: (roleCode: RoleCode) => void;
  name: string;
  onNameChange: (name: string) => void;
  organizationId: string;
  onOrganizationIdChange: (organizationId: string) => void;
  organizations: Organization[];
  isPendingOrganizations: boolean;
  isErrorOrganizations: boolean;
  isOrganizationDropdownOpen: boolean;
  onOrganizationDropdownOpenChange: (isOpen: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  emailState: InputState;
  emailErrorMessage: string;
  emailFeedbackMessage: string;
  canRequestCode: boolean;
  isPendingSendVerificationCode: boolean;
  isCodeSent: boolean;
  onRequestCode: () => void;
}

export default function MemberInfoSection({
  roleCode,
  onRoleCodeChange,
  name,
  onNameChange,
  organizationId,
  onOrganizationIdChange,
  organizations,
  isPendingOrganizations,
  isErrorOrganizations,
  isOrganizationDropdownOpen,
  onOrganizationDropdownOpenChange,
  email,
  onEmailChange,
  emailState,
  emailErrorMessage,
  emailFeedbackMessage,
  canRequestCode,
  isPendingSendVerificationCode,
  isCodeSent,
  onRequestCode,
}: MemberInfoSectionProps) {
  const selectedOrganizationId = Number(organizationId);
  const selectedOrganization = organizations.find(
    (organization) => organization.organizationId === selectedOrganizationId,
  );

  return (
    <div className="mb-3.75 flex flex-col gap-2 px-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-normal text-[#434343]">회원 정보</p>
        <div className="grid h-6.75 w-50 grid-cols-2 rounded-sm bg-[#F0F2F8] p-0.5">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = roleCode === option.value;

            return (
              <button
                type="button"
                key={option.value}
                className={`cursor-pointer rounded-sm text-[12px] font-medium transition-colors ${
                  isSelected
                    ? "border-[0.5px] border-[#DDE3EF] bg-white text-[#1A2236]"
                    : "text-[#8892A6]"
                }`}
                onClick={() => onRoleCodeChange(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <Input
        placeholder="이름"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        state={name ? "active" : "default"}
        autoComplete="name"
      />
      <div className="relative">
        <button
          type="button"
          className={`h-13.25 w-full rounded-lg border bg-white px-4.5 text-left text-sm font-normal transition-colors outline-none focus:border-[#8DB4FF] disabled:bg-white disabled:text-[#09121C]/50 ${
            selectedOrganization
              ? "border-[#2663EB]/70 text-[#09121C]"
              : "border-[#BDBDBD] text-[#09121C]/50"
          }`}
          disabled={isPendingOrganizations || isErrorOrganizations}
          onClick={() =>
            onOrganizationDropdownOpenChange(!isOrganizationDropdownOpen)
          }
        >
          {isPendingOrganizations
            ? "부서 목록을 불러오는 중"
            : isErrorOrganizations
              ? "부서 목록을 불러오지 못했습니다"
              : selectedOrganization?.organizationName || "부서명"}
        </button>
        {isOrganizationDropdownOpen && organizations.length > 0 ? (
          <div className="absolute top-[calc(100%+5px)] left-0 z-20 flex max-h-[207px] w-full flex-col gap-1 overflow-y-auto rounded-lg border border-[#C6CBD4] bg-white p-2 shadow-sm">
            {organizations.map((organization) => {
              const isSelected =
                organization.organizationId === selectedOrganizationId;

              return (
                <button
                  type="button"
                  key={organization.organizationId}
                  className={`flex h-[45px] w-full shrink-0 cursor-pointer items-center gap-2 rounded-md px-2.5 text-left text-[14px] leading-6 font-medium active:bg-[#D4DFED] ${
                    isSelected
                      ? "bg-[#E7EDF5] text-[#052B57]"
                      : "text-[#1A2236] hover:bg-[#EEF2F7]"
                  }`}
                  onClick={() => {
                    onOrganizationIdChange(String(organization.organizationId));
                    onOrganizationDropdownOpenChange(false);
                  }}
                >
                  {isSelected ? (
                    <Image src={icCheck} alt="선택됨" aria-hidden="true" />
                  ) : null}
                  <span>{organization.organizationName}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <div>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          state={emailState}
          autoComplete="email"
        />
        <div className="mt-2 flex items-start justify-between gap-3">
          {emailErrorMessage ? (
            <p className="min-w-0 flex-1 text-[14px] font-medium text-[#FF5B4D]">
              {emailErrorMessage}
            </p>
          ) : emailFeedbackMessage ? (
            <p className="min-w-0 flex-1 text-[14px] font-medium text-[#2076FF]">
              {emailFeedbackMessage}
            </p>
          ) : (
            <span className="min-w-0 flex-1" />
          )}
          <Button
            type="button"
            disabled={!canRequestCode}
            onClick={onRequestCode}
          >
            {isPendingSendVerificationCode
              ? "전송 중"
              : isCodeSent
                ? "다시 보내기"
                : "인증번호 받기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
