/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
 
ZaCertsServerListView = function(parent) {
	ZaServerListView.call (this, parent);
	this._certInstallStatus = new DwtAlert (this) ;
	this._certInstallStatus.setIconVisible(false) ;
	
	//show the certInstallStatus at the top the list view
	var listEl = this.getHtmlElement() ;
	var certInstallStatusEl = this._certInstallStatus.getHtmlElement();
	listEl.insertBefore (certInstallStatusEl, listEl.firstChild) ;	
}

ZaCertsServerListView.prototype = new ZaServerListView;
ZaCertsServerListView.prototype.constructor = ZaCertsServerListView;

ZaCertsServerListView.prototype.toString = 
function() {
	return "ZaCertsServerListView";
}

ZaCertsServerListView.prototype.getTitle = 
function () {
	return com_zimbra_cert_manager.manage_certs_title ;
}

ZaCertsServerListView.prototype.getTabIcon =
function () {
	return "Server";
}

ZaCertsServerListView.prototype.set = 
function (list, defaultColumnSort) {
	DwtListView.prototype.set.call(this, list, defaultColumnSort);
	if (ZaCertWizard.INSTALL_STATUS < 0) {
		this._certInstallStatus.setDisplay (Dwt.DISPLAY_NONE) ;
	}else {
		this._certInstallStatus.setDisplay (Dwt.DISPLAY_BLOCK) ;
	}
}