export const getLoggedInUser = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    }
    return null;
  };
  