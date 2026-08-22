// 401·403은 화면이 잘못된 것이 아니라 그 사용자가 그 자리에 있으면 안 된다는 뜻이다.
// 화면마다 따로 다루지 않고 여기 한 곳에 모아 두고, 루트에 있는 모달 하나가 구독해 보여 준다.
export interface AuthNotice {
  message: string;
  // 확인을 누르면 로그인 화면으로 내보낼지. 권한 부족(403)은 알리기만 한다.
  shouldRedirectToLogin: boolean;
}

type AuthNoticeListener = () => void;

const listeners = new Set<AuthNoticeListener>();

let authNotice: AuthNotice | null = null;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

export const subscribeAuthNotice = (listener: AuthNoticeListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getAuthNotice = () => authNotice;

// 이미 떠 있는 안내가 있으면 덮어쓰지 않는다.
// 한 화면에서 조회 여러 개가 동시에 막혀도 사용자가 읽는 문구는 하나로 유지된다.
//
// 다만 로그인으로 내보내는 안내는 예외다. 그 시점에는 저장된 토큰이 이미 지워져 있어서,
// 권한 안내에 가려 버리면 사용자가 아무것도 할 수 없는 화면에 그대로 남는다.
export const showAuthNotice = (notice: AuthNotice) => {
  const isMoreUrgent =
    notice.shouldRedirectToLogin && !authNotice?.shouldRedirectToLogin;

  if (authNotice !== null && !isMoreUrgent) {
    return;
  }

  authNotice = notice;
  notify();
};

export const clearAuthNotice = () => {
  if (authNotice === null) {
    return;
  }

  authNotice = null;
  notify();
};
