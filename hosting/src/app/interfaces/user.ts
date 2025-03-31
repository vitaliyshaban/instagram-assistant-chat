export interface IUser {
  email: string;
  displayName: string;
  uid?: string;
  api?: IInstaUser,
}
export interface IInstaUser {
  name?: string,
  id?: string,
  token?: string,
  url_api?: string,
  picture?: {
    data: {
      url: string
    }
  }
}