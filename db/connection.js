let instance = null;

class DBClass {
  constructor(props) {
    this.properties = props;
    this._conn = null;
  }

  connect() {
    this._conn = driver.connect(this.props);
  }

  get conn() {
    return this._conn;
  }

  static getInstance() {
    if (!instance) {
      instance = new DBClass();
    }

    return instance;
  }
}

module.exports = DBClass;
